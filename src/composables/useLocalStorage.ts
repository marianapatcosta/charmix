type UseLocalStorageProps = {
  getStoredItem: <T>(collection: string) => T | undefined;
  saveItemInStorage: <T>(collection: string, item: T) => void;
  removeStoredItem: <T>(collection: string) => void;
};

const useLocalStorage = (): UseLocalStorageProps => {
  const getStoredItem = <T>(collection: string): T | undefined => {
    const storedItem = localStorage.getItem(collection);
    if (!storedItem) {
      return;
    }
    const parsedStoredItem: T = JSON.parse(storedItem);
    return parsedStoredItem;
  };

  const saveItemInStorage = <T>(collection: string, item: T) => {
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(collection, stringifiedItem);
  };

  const removeStoredItem = (collection: string) => {
    localStorage.removeItem(collection);
  };

  return { getStoredItem, saveItemInStorage, removeStoredItem };
};

export { useLocalStorage };
