import React from 'react'
import {
  Dialog,
  DialogContent,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SignUpOrLogIn from '../SignupOrLogin'
// import { Button } from '@/components/ui/button';

type AuthRequiredDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
}

export const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
  isOpen,
  onOpenChange,
  title = 'Authentication Required',
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <SignUpOrLogIn onSuccessfulLogin={() => onOpenChange(false)}>{children}</SignUpOrLogIn>
        {/* <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4"> */}
        {/* <Button
            type="button"
            variant="outline"
            onClick={redirectToSignup}
            className="sm:w-full"
          >
            Sign up
          </Button>
          <Button 
            type="button"
            onClick={redirectToLogin}
            className="sm:w-full"
          >
            Login
          </Button> */}
        {/* </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
