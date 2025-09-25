export interface courseDTO {
    title: string;
    description?: string;
}


export interface GetCoursesFilterDTO {
  title?: string;
  description?: string;
  instructor?: string;
}
