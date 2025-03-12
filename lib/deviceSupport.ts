"use client";

export function canHandle3D(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext;

    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "";

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      const isHighEnd = /(Apple GPU|Adreno 6|Mali-G7|PowerVR)/i.test(renderer);
      return isHighEnd;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export function get3DQualityFactor(): number {
  if (typeof window === "undefined") return 0.5;

  try {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const memory = (navigator as any).deviceMemory || 4;

    let factor = (memory / 8) * (isMobile ? 0.5 : 1);

    return Math.min(Math.max(factor, 0.3), 1.0);
  } catch (e) {
    return 0.5;
  }
}
