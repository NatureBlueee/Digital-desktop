import DesktopGrid from "@/components/os/Desktop/DesktopGrid";
import Taskbar from "@/components/os/Taskbar/Taskbar";
import WindowManager from "@/components/os/Window/WindowManager";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[url('/wallpaper.jpg')] bg-cover bg-center relative select-none">
      {/* Desktop Layer */}
      <div className="absolute inset-0 z-0">
        <DesktopGrid />
      </div>

      {/* Window Layer (Z-Index handled by WindowManager) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <WindowManager />
      </div>
      {/* Taskbar Layer */}
      <Taskbar />
    </main>
  );
}
