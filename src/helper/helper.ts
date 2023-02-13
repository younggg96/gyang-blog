type paginateData = { page: number; total: number; row: number; data: any[] };

export const paginate = ({ page, row, total, data }: paginateData) => {
  return {
    meta: {
      current_page: page,
      row: row,
      total,
      page_row: Math.ceil(total / row),
    },
    data,
  };
};

export const sleep = (time: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Sleep');
    }, time);
  });
};
