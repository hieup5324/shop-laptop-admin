import { Toaster } from "sonner";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <Toaster position="top-right" className="z-50" />
    </div>
  );
}
