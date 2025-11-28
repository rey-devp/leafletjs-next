"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Location } from "@/lib/types/location";
import { deleteLocation } from "@/lib/api/locations";
import { toast } from "sonner";

interface DeleteLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onLocationDeleted: () => void;
}

export function DeleteLocationDialog({
  open,
  onOpenChange,
  location,
  onLocationDeleted,
}: DeleteLocationDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!location) return;

    setLoading(true);
    try {
      await deleteLocation(location._id);
      toast.success("Lokasi berhasil dihapus");
      onOpenChange(false);
      onLocationDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus lokasi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Lokasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus lokasi &quot;{location?.name}
            &quot;? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
