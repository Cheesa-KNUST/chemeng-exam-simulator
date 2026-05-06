export function useToast() {
  const toast = (msg: string, success = true) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium text-white ${
      success ? "bg-emerald-600" : "bg-red-600"
    }`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };
  return { toast };
}
