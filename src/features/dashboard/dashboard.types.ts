export interface StatusCount {
  status: string;
  count: number;
}

export interface DepartmentCount {
  id: string;
  name: string;
  count: number;
}

export interface ScanDay {
  day: string;
  scans: number;
}

export interface DashboardStats {
  total: number;
  in_use: number;
  attention: number;
  printed: number;
  scanned_today: number;
  by_status: StatusCount[];
  by_department: DepartmentCount[];
  scans_7d: ScanDay[];
}
