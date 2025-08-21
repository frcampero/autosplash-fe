import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
        isCollapsed ? "md:grid-cols-[5rem_1fr]" : "md:grid-cols-[14rem_1fr]"
      )}
    >
      <div className="hidden border-r bg-background md:block relative">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden focus:ring-0 focus:border-gray-200"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-72">
              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => {}}
                showCollapseButton={false}
                isMobile={true}
                onNavigate={() => document.activeElement && (document.activeElement as HTMLElement).blur()}
              />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">

          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;