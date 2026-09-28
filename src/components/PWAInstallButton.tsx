import React, { useState } from "react";
import { usePWAInstall } from "./usePWAInstall";
import { Download, Smartphone, X } from "lucide-react";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition shadow-xs"
        title="Install IPE-LAMS to Mobile or Desktop"
      >
        <Download className="w-3.5 h-3.5 text-sky-600" />
        <span>Install PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-ios-install"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition shadow-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-bold text-slate-900">Install IPE-LAMS on iPhone / iPad</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button in Safari.<br />
                2. Select <strong>Add to Home Screen</strong>.<br />
                3. The offline polar field app will launch fullscreen with offline caching.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
