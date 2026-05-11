"use client";

import { motion } from "framer-motion";
import { Check, Clock, Upload, FileCheck, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────

export type StepStatus = "pending" | "active" | "completed";

export interface TrackerStep {
  id: string;
  label: string;
  description: string;
  estimatedTime: string;
  status: StepStatus;
  documentUploaded?: boolean;
  documentRequired?: boolean;
}

export interface LayananProgressTrackerProps {
  /** Current active step (0-indexed) */
  currentStep: number;
  /** Optional submission data for document indicators */
  submissionData?: {
    dokumen?: Array<{
      namaDokumen: string;
      fileName: string;
      fileSize: number;
    }>;
    status: string;
    tanggalPengajuan?: string;
    tanggalProses?: string;
    tanggalSelesai?: string;
  };
  /** Optional class name for the container */
  className?: string;
  /** Optional variant for display mode */
  variant?: "default" | "compact";
}

// ─── Default Steps ─────────────────────────────────────────────────────

const defaultSteps: Omit<TrackerStep, "status">[] = [
  {
    id: "pengajuan",
    label: "Pengajuan",
    description: "Formulir dikirim dan diterima sistem",
    estimatedTime: "Instan",
  },
  {
    id: "verifikasi",
    label: "Verifikasi",
    description: "Dokumen diverifikasi oleh petugas",
    estimatedTime: "1-2 hari kerja",
    documentRequired: true,
  },
  {
    id: "proses",
    label: "Diproses",
    description: "Data diproses dan dicetak",
    estimatedTime: "1-5 hari kerja",
  },
  {
    id: "selesai",
    label: "Selesai",
    description: "Dokumen siap diambil",
    estimatedTime: "1 hari kerja",
  },
  {
    id: "diambil",
    label: "Diambil",
    description: "Dokumen telah diterima pemohon",
    estimatedTime: "-",
  },
];

// ─── Animation Variants ────────────────────────────────────────────────

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.6, 1, 0.6],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

const checkmark = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────

function getStepStatus(currentStep: number, stepIndex: number): StepStatus {
  if (stepIndex < currentStep) return "completed";
  if (stepIndex === currentStep) return "active";
  return "pending";
}

function mapApiStatusToStep(apiStatus: string): number {
  switch (apiStatus?.toLowerCase()) {
    case "pending":
    case "diajukan":
    case "menunggu":
      return 0;
    case "diverifikasi":
    case "verifikasi":
      return 1;
    case "diproses":
    case "proses":
      return 2;
    case "selesai":
    case "siap_diambil":
      return 3;
    case "diambil":
    case "selesai_diambil":
      return 4;
    default:
      return 0;
  }
}

// ─── Component ─────────────────────────────────────────────────────────

export function LayananProgressTracker({
  currentStep: currentStepProp,
  submissionData,
  className,
  variant = "default",
}: LayananProgressTrackerProps) {
  // If submission data with API status is provided, map to step
  const currentStep = submissionData
    ? mapApiStatusToStep(submissionData.status)
    : currentStepProp;

  const steps: TrackerStep[] = defaultSteps.map((step, i) => ({
    ...step,
    status: getStepStatus(currentStep, i),
    documentUploaded:
      submissionData?.dokumen && submissionData.dokumen.length > 0
        ? true
        : undefined,
  }));

  const isCompact = variant === "compact";

  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={steps.length - 1} aria-label="Progress pengajuan layanan">
      {/* Mobile Vertical Layout */}
      <div className="flex flex-col md:hidden">
        {steps.map((step, index) => (
          <ProgressStepVertical
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
            compact={isCompact}
          />
        ))}
      </div>

      {/* Desktop Horizontal Layout */}
      <div className="hidden md:flex items-start">
        {steps.map((step, index) => (
          <ProgressStepHorizontal
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
            compact={isCompact}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal Step (Desktop) ─────────────────────────────────────────

interface StepProps {
  step: TrackerStep;
  index: number;
  isLast: boolean;
  compact: boolean;
}

function ProgressStepHorizontal({ step, index, isLast, compact }: StepProps) {
  const isCompleted = step.status === "completed";
  const isActive = step.status === "active";
  const isPending = step.status === "pending";

  return (
    <div className="flex items-start flex-1 last:flex-none">
      {/* Step Circle + Connector */}
      <div className="flex flex-col items-center">
        {/* Circle */}
        <div className="relative">
          {isActive && (
            <motion.div
              className="absolute -inset-2 rounded-full bg-green-400/20 dark:bg-green-500/20"
              animate={pulseGlow}
            />
          )}
          <motion.div
            initial={false}
            animate={{
              scale: isActive ? 1.1 : 1,
              backgroundColor: isCompleted
                ? "#15803d"
                : isActive
                ? "#15803d"
                : isPending
                ? "var(--color-muted, #e5e7eb)"
                : "#15803d",
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative flex items-center justify-center rounded-full transition-colors duration-300",
              isCompleted && "bg-green-600",
              isActive && "bg-green-600",
              isPending && "bg-gray-200 dark:bg-gray-700"
            )}
            style={{
              width: compact ? "32px" : "40px",
              height: compact ? "32px" : "40px",
            }}
          >
            {isCompleted ? (
              <motion.div variants={checkmark} initial="hidden" animate="visible">
                <Check className="text-white" style={{ width: compact ? 16 : 18, height: compact ? 16 : 18 }} />
              </motion.div>
            ) : (
              <span
                className={cn(
                  "font-bold text-sm",
                  isActive
                    ? "text-white"
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                {index + 1}
              </span>
            )}
          </motion.div>

          {/* Document indicator */}
          {step.documentRequired && (
            <div className="absolute -bottom-1 -right-1">
              {step.documentUploaded ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  <FileCheck className="h-3 w-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  <Upload className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="relative mt-1" style={{ width: compact ? "48px" : "72px" }}>
            <div
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                isCompleted
                  ? "bg-green-500"
                  : isActive
                  ? "bg-gradient-to-r from-green-500 to-green-200 dark:to-green-800"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
            {isActive && (
              <motion.div
                className="absolute top-0 left-0 h-1 w-3 bg-green-400 rounded-full"
                animate={{ x: [0, 72, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        )}
      </div>

      {/* Label */}
      <div className={cn("ml-2.5 mt-0.5", isLast && "text-right")}>
        <p
          className={cn(
            "font-semibold text-sm leading-tight",
            isActive
              ? "text-green-700 dark:text-green-400"
              : isCompleted
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          )}
        >
          {step.label}
        </p>
        {!compact && (
          <>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 max-w-[100px] leading-tight">
              {step.description}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-gray-300 dark:text-gray-600" />
              <span className="text-[10px] text-gray-300 dark:text-gray-600">
                {step.estimatedTime}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Vertical Step (Mobile) ────────────────────────────────────────────

function ProgressStepVertical({ step, index, isLast, compact }: StepProps) {
  const isCompleted = step.status === "completed";
  const isActive = step.status === "active";
  const isPending = step.status === "pending";

  return (
    <div className="flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {isActive && (
            <motion.div
              className="absolute -inset-1.5 rounded-full bg-green-400/20 dark:bg-green-500/20"
              animate={pulseGlow}
            />
          )}
          <motion.div
            initial={false}
            className={cn(
              "relative flex items-center justify-center rounded-full transition-colors duration-300",
              isCompleted && "bg-green-600",
              isActive && "bg-green-600",
              isPending && "bg-gray-200 dark:bg-gray-700"
            )}
            style={{
              width: compact ? "30px" : "36px",
              height: compact ? "30px" : "36px",
            }}
          >
            {isCompleted ? (
              <motion.div variants={checkmark} initial="hidden" animate="visible">
                <Check className="text-white" style={{ width: compact ? 14 : 16, height: compact ? 14 : 16 }} />
              </motion.div>
            ) : isActive ? (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            ) : (
              <Circle className="text-gray-400 dark:text-gray-500" style={{ width: compact ? 14 : 16, height: compact ? 14 : 16 }} />
            )}
          </motion.div>

          {/* Document indicator */}
          {step.documentRequired && (
            <div className="absolute -bottom-1 -right-1">
              {step.documentUploaded ? (
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  <FileCheck className="h-2.5 w-2.5 text-white" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  <Upload className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vertical connector line */}
        {!isLast && (
          <div className="relative my-1 w-0.5 h-10">
            <div
              className={cn(
                "w-full rounded-full transition-all duration-500",
                isCompleted
                  ? "bg-green-500"
                  : isActive
                  ? "bg-gradient-to-b from-green-500 to-green-200 dark:to-green-800"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-6", isLast && "pb-0")}>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "font-semibold text-sm leading-tight",
              isActive
                ? "text-green-700 dark:text-green-400"
                : isCompleted
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            {step.label}
          </p>
          {step.documentRequired && (
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
              step.documentUploaded
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            )}>
              {step.documentUploaded ? "Dokumen Lengkap" : "Perlu Dokumen"}
            </span>
          )}
        </div>
        {!compact && (
          <>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {step.description}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <Clock className="h-3 w-3 text-gray-300 dark:text-gray-600" />
              <span className="text-[10px] text-gray-300 dark:text-gray-600">
                Estimasi: {step.estimatedTime}
              </span>
            </div>
          </>
        )}

        {/* Active step callout */}
        {isActive && !compact && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50"
          >
            <p className="text-[11px] text-green-700 dark:text-green-400 font-medium flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Sedang dalam proses
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
