export const setItemLocalStorage = (key: string, value: any) => {
  if (process.client) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

type Item = {
  key: string;
  tanggal: string;
  jumlah: number;
  keterangan: string;
};

export const getAllItemFromLocalStorage = (): Item[] => {
  const items: Item[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key) {
      if (key.length > 4) {
        continue;
      }

      try {
        if (!localStorage.getItem(key)) {
          continue;
        }

        const storedItem = JSON.parse(localStorage.getItem(key) as string);

        items.push(JSON.parse(storedItem));
      } catch (e) {
        console.error(`Failed to parse item with key ${key}:`, e);
      }
    }
  }

  return items;
};

export const getItem = (key: string) => {
  if (process.client) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const removeItem = (key: string) => {
  if (process.client) {
    localStorage.removeItem(key);
  }
};

export const generateRandomKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};
