import Image from "next/image";

export default function SkeletonPhone() {
  return (
    <div className="relative w-[300px] h-[630px] rounded-[40px] overflow-hidden bg-white shadow-2xl">
      <Image
        src="/assets/svg/app-driver.svg"
        alt="Phone Interface"
        fill
        priority
        className="object-cover z-10"
      />
    </div>
  );
}
