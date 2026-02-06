import React, { useState } from 'react';
import Card from '../atoms/Card';
import Heading from '../atoms/Heading';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <Heading level={2} className="mb-6 text-center">Login</Heading>
      
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          required
          inputType="email"
          inputValue={email}
          inputOnChange={(e) => setEmail(e.target.value)}
          inputPlaceholder="your@email.com"
          inputDisabled={isLoading}
        />

        <FormField
          label="Password"
          required
          inputType="password"
          inputValue={password}
          inputOnChange={(e) => setPassword(e.target.value)}
          inputPlaceholder="Enter your password"
          inputDisabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="w-full mt-6"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
