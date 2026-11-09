export interface PageDto<T> {
  content: Array<T>;
  total_count: number;
}

export interface Page<T> {
  content: Array<T>;
  totalCount: number;
}

export const toPage = <T>(pageDto: PageDto<T>): Page<T> => {
  return {
    content: pageDto.content,
    totalCount: pageDto.total_count,
  };
};
