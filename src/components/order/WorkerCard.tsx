import type { Technician } from "@entities/order";

interface WorkerCardProps {
  worker: Technician;
}

// 사진 칸 단일 — 가로/세로 원본 무관 세로 박스에 object-cover로 채움.
const PHOTO_BOX = "w-[118px] h-[148px] rounded-lg";

function PhotoPlaceholder() {
  return (
    <div
      className={`shrink-0 border border-kt-gray-200 flex items-center justify-center overflow-hidden bg-stripe-placeholder ${PHOTO_BOX}`}
    >
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="13" r="6.5" fill="var(--color-kt-gray-300)" />
        <path
          d="M4 33c0-7.732 6.268-14 14-14s14 6.268 14 14"
          stroke="var(--color-kt-gray-300)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function NameBlock({ name }: { name: string }) {
  return (
    <>
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1.5">
        방문 직원
      </div>
      <div className="text-[18px] font-bold text-kt-ink tracking-[-0.5px]">
        {name}
      </div>
    </>
  );
}

function PhoneBlock({ phone }: { phone: string }) {
  const telHref = `tel:${phone.replace(/\D/g, "")}`;
  return (
    <>
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1.5">
        연락처
      </div>
      <a
        href={telHref}
        className="text-[18px] font-bold text-kt-ink tracking-[-0.5px]"
      >
        {phone}
      </a>
    </>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[12px] px-4 pt-3.5 pb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="text-[14px] font-bold text-kt-ink mb-3 pb-[11px] border-b border-kt-gray-200">
        방문 작업자 정보
      </div>
      {children}
    </div>
  );
}

function WorkerCard({ worker }: WorkerCardProps) {
  const hasPic = !!worker.workerPhotoUrl;

  return (
    <CardShell>
      <div className="flex gap-4 items-center px-0.5 py-1">
        {hasPic ? (
          <img
            src={worker.workerPhotoUrl}
            alt={worker.workerName}
            className={`shrink-0 border border-kt-gray-200 object-cover ${PHOTO_BOX}`}
          />
        ) : (
          <PhotoPlaceholder />
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <NameBlock name={worker.workerName} />
          <div className="h-px bg-kt-gray-200 my-2.5" />
          <PhoneBlock phone={worker.workerPhoneNumber} />
        </div>
      </div>
    </CardShell>
  );
}

export default WorkerCard;
