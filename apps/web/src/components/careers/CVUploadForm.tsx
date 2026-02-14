import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { Upload, CheckCircle, FileText, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  cvUploadSchema,
  type CVUploadFormData,
} from "./schemas/cv-upload-schema";
import { useSubmitApplication } from "@/hooks/api";

interface CVDropzoneProps {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  error?: string;
}

/**
 * Dropzone component for CV file upload.
 * Extracted to satisfy rules of hooks (useDropzone cannot be inside render callback).
 */
function CVDropzone({ value, onChange, error }: CVDropzoneProps) {
  const { t } = useTranslation("careers");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragActive
            ? "border-jerash-orange bg-jerash-orange/5"
            : "border-white/15 hover:border-jerash-orange/50",
          error && "border-red-500/50",
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="flex items-center gap-3">
            <FileText className="size-10 text-jerash-orange" />
            <div className="text-left">
              <p className="font-medium text-white">{value.name}</p>
              <p className="text-sm text-white/50">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
            >
              <X className="size-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto size-10 text-white/30" />
            <p className="mt-2 text-sm text-white/40">
              {t("dropzone.placeholder")}
            </p>
            <p className="mt-1 text-xs text-white/30">
              {t("dropzone.acceptedFormats")}
            </p>
            <p className="text-xs text-white/30">
              {t("dropzone.maxSize")}
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{t(error)}</p>}
    </div>
  );
}

/**
 * CV submission form with drag-and-drop file upload.
 * Uses react-hook-form + Zod for validation and react-dropzone for file handling.
 * Submits to API backend.
 */
export function CVUploadForm() {
  const { t } = useTranslation("careers");
  const [showSuccess, setShowSuccess] = useState(false);
  const submitApplication = useSubmitApplication();

  const form = useForm<CVUploadFormData>({
    resolver: zodResolver(cvUploadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cv: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = form;

  const selectedFile = watch("cv");

  const onSubmit = async (data: CVUploadFormData) => {
    try {
      await submitApplication.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cv: data.cv,
      });

      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error("CV Application submission failed:", error);
    }
  };

  const handleReset = () => {
    reset();
    setShowSuccess(false);
    submitApplication.reset();
  };

  const isSubmitting = submitApplication.isPending;

  return (
    <div id="cv-upload" className="glass rounded-2xl scroll-mt-36">
      <div className="p-6 pb-0">
        <h2 className="font-semibold leading-none text-white">{t("upload.title")}</h2>
        <p className="mt-2 text-sm text-white/50">{t("upload.description")}</p>
      </div>
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Error Alert */}
              {submitApplication.isError && (
                <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{t("error.submission")}</span>
                </div>
              )}

              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">{t("form.name")}</Label>
                <Input
                  id="name"
                  placeholder={t("form.namePlaceholder")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">
                    {t(errors.name.message as string)}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">{t("form.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">
                    {t(errors.email.message as string)}
                  </p>
                )}
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">{t("form.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("form.phonePlaceholder")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-400">
                    {t(errors.phone.message as string)}
                  </p>
                )}
              </div>

              {/* CV File dropzone */}
              <div className="space-y-2">
                <Label className="text-white">{t("form.cv")}</Label>
                <CVDropzone
                  value={selectedFile}
                  onChange={(file) =>
                    setValue("cv", file as File, { shouldValidate: true })
                  }
                  error={errors.cv?.message}
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-jerash-orange hover:bg-jerash-orange/90"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  t("form.submit")
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <CheckCircle className="mx-auto size-16 text-jerash-orange" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                {t("success.title")}
              </h3>
              <p className="mt-2 text-white/50">
                {t("success.message")}
              </p>
              <Button
                variant="outline"
                className="mt-6 border-jerash-orange text-jerash-orange hover:bg-jerash-orange hover:text-white"
                onClick={handleReset}
              >
                {t("form.submit")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
