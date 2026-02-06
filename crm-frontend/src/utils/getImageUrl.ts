const S3_BASE_URL = process.env.REACT_APP_S3_URL || "";

const getImageUrl = (photoUrl: string): string => {
  if (!photoUrl) return "";
  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }
  console.log(`Using S3 URL: ${S3_BASE_URL}/${photoUrl}`);
  return `${S3_BASE_URL}/${photoUrl}`;
};

export default getImageUrl;
