import React, { useEffect, useRef, useState } from "react";
import { MdRefresh, MdStopCircle } from "react-icons/md";
import getImageUrl from "../../utils/getImageUrl";
import Alert from "../atoms/Alert";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Heading from "../atoms/Heading";
import FormField from "../molecules/FormField";

type Mode = "checkin" | "checkout" | "done";

interface CheckInFormProps {
  mode: Mode;
  attendance?: any;
  employeeName?: string;
  onCheckIn: (data: { photoFile: File; notes: string }) => Promise<void>;
  onCheckOut?: (data: { photoFile: File }) => Promise<void>;
  isLoading?: boolean;
}

const CheckInForm: React.FC<CheckInFormProps> = ({
  mode,
  attendance,
  employeeName,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (
      (mode === "checkin" || mode === "checkout") &&
      !photoFile &&
      !cameraOn
    ) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, photoFile]);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("autoplay", "");
        videoRef.current.setAttribute("playsinline", "");
        videoRef.current.play().catch((err) => {
          console.warn("Video play warning:", err);
        });
      }
      setCameraOn(true);
    } catch (err) {
      setError("Unable to access camera. Please allow camera permission.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    setCameraOn(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setPhotoFile(file);
          setPhotoPreview(URL.createObjectURL(file));
        }
      },
      "image/jpeg",
      0.8,
    );

    stopCamera();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!photoFile) {
      setError("Please capture a photo before check-in");
      return;
    }

    try {
      await onCheckIn({ photoFile, notes });
      setSuccess("Check-in successful!");
      setPhotoFile(null);
      setPhotoPreview("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    if (!onCheckOut) return;
    if (!photoFile) {
      setError("Please capture a photo before check-out");
      return;
    }
    setError("");
    setSuccess("");
    try {
      await onCheckOut({ photoFile });
      setSuccess("Check-out successful!");
      setPhotoFile(null);
      setPhotoPreview("");
    } catch (err: any) {
      setError(err.message || "Check-out failed");
    }
  };

  return (
    <Card>
      <Heading level={3} className="mb-6">
        {mode === "checkin" && "Check In"}
        {mode === "checkout" && "Check Out"}
        {mode === "done" && "Attendance Completed"}
      </Heading>

      {employeeName && (
        <p className="text-sm text-gray-600 mb-4">Employee: {employeeName}</p>
      )}

      {error && (
        <Alert type="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {(mode === "checkout" || mode === "done") && attendance?.checkInTime && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">Check-in Time</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date(attendance.checkInTime).toLocaleString()}
          </p>
          {attendance.photoUrl && (
            <img
              src={getImageUrl(attendance.photoUrl)}
              alt="Check-in proof"
              className="mt-3 w-full max-w-sm rounded-lg border"
            />
          )}
        </div>
      )}

      {mode === "done" && attendance?.checkOutTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">Check-out Time</p>
          <p className="text-lg font-semibold text-green-700">
            {new Date(attendance.checkOutTime).toLocaleString()}
          </p>
        </div>
      )}

      {mode === "checkin" && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                {!photoFile && (
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-auto"
                        autoPlay
                        playsInline
                        muted
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={capturePhoto}
                        className="flex-1"
                      >
                        Capture Photo
                      </Button>
                      {cameraOn && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={stopCamera}
                        >
                          <MdStopCircle className="inline mr-2" size={18} />
                          Stop Camera
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {photoFile && photoPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Captured Photo
                  </p>
                  <img
                    src={photoPreview}
                    alt="Captured"
                    className="w-full rounded-lg border border-gray-300 shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview("");
                      startCamera();
                    }}
                    className="w-full"
                  >
                    <MdRefresh className="inline mr-2" size={18} />
                    Retake Photo
                  </Button>
                </div>
              )}
            </div>

            <FormField
              label="Notes"
              inputValue={attendance?.notes || notes}
              inputOnChange={(e) =>
                mode === "checkin" && setNotes(e.target.value)
              }
              inputPlaceholder="Any additional notes..."
              inputDisabled={isLoading || mode !== "checkin"}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="flex-1"
              >
                {isLoading ? "Checking In..." : "Check In"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview("");
                  setNotes("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      )}

      {mode === "checkout" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckOut();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                {!photoFile && (
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-auto"
                        autoPlay
                        playsInline
                        muted
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={capturePhoto}
                        className="flex-1"
                      >
                        Capture Photo
                      </Button>
                      {cameraOn && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={stopCamera}
                        >
                          <MdStopCircle className="inline mr-2" size={18} />
                          Stop Camera
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {photoFile && photoPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Check-out Photo
                  </p>
                  <img
                    src={photoPreview}
                    alt="Captured"
                    className="w-full rounded-lg border border-gray-300 shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview("");
                      startCamera();
                    }}
                    className="w-full"
                  >
                    <MdRefresh className="inline mr-2" size={18} />
                    Retake Photo
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || !photoFile}
                variant="primary"
                className="flex-1"
              >
                {isLoading ? "Checking Out..." : "Check Out"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {mode === "done" && (
        <div className="text-sm text-gray-600">
          You have completed today&apos;s attendance.
        </div>
      )}
    </Card>
  );
};

export default CheckInForm;
