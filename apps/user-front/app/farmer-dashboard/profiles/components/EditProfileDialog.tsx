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
      <DialogContent className="sm:max-w-[500px] bg-background border border-border/40 rounded-[2.5rem] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/50 to-secondary" />
        
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-black tracking-tighter text-heading">
            Refine Profile
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
            Update your personal coordinates and market identity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Full Legal Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20 transition-all font-bold"
                  placeholder="Artisan Name"
                />
              </div>
              {errors.name && <p className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1">{errors.name.message}</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Contact Hotline
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  {...register("phone", { required: "Phone number is required" })}
                  className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20 transition-all font-bold text-lg tracking-tighter"
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
