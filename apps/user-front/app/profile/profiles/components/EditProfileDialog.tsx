"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMe } from "@/lib/hooks/useAuth";
import { Loader2, User, Phone, Save } from "lucide-react";

interface EditProfileDialogProps {
  user: any;
  children: React.ReactNode;
}

interface FormValues {
  name: string;
  phone: string;
}

export const EditProfileDialog = ({ user, children }: EditProfileDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { mutate: updateMe, isPending } = useUpdateMe();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    }
  });

  // Sync form with user data when it arrives or changes
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormValues) => {
    updateMe(data, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] bg-background/80 backdrop-blur-2xl border border-border/40 rounded-[1.8rem] sm:rounded-[2.5rem] overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/50 to-secondary" />

        <DialogHeader className="p-5 sm:p-8 pb-4">
          <DialogTitle className="text-3xl font-bold tracking-tight">
            Edit Information
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Refine your personal coordinates and account identity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 pt-0 space-y-6">
          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <p className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1">{errors.name.message}</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Contact Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input
                  id="phone"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold tracking-tight outline-none"
                  placeholder="+94 7X XXX XXXX"
                />
              </div>
              {errors.phone && <p className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1">{errors.phone.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
