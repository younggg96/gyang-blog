type paginateData = { page: number; total: number; row: number; data: any[] };

export const paginate = ({ page, row, total, data }: paginateData) => {
  return {
    meta: {
      curPage: page,
      row: row,
      total,
      pageRow: Math.ceil(total / row),
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
