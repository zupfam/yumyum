import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

export function LoginEntryPoint() {
  return (
    <Link to="/login">
      <Button variant="ghost" size="sm">
        <LogIn className="mr-2 h-4 w-4" />
        Vendor Login
      </Button>
    </Link>
  );
}
