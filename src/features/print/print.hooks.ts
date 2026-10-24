import { useMutation } from "@tanstack/react-query";

import { printApi, type PrintLabelsRequest } from "./print.api";

export function usePrintLabels() {
  return useMutation({
    mutationFn: (payload: PrintLabelsRequest) => printApi.labels(payload),
  });
}
