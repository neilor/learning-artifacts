// IndexedDB wrapper para persistência de dados
class LearningDB {
  constructor() {
    this.dbName = "ai-ceo-learning-db";
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store para itens completados
        if (!db.objectStoreNames.contains("completedItems")) {
          db.createObjectStore("completedItems", { keyPath: "id" });
        }

        // Store para dias completados
        if (!db.objectStoreNames.contains("completedDays")) {
          db.createObjectStore("completedDays", { keyPath: "id" });
        }

        // Store para ferramentas completadas
        if (!db.objectStoreNames.contains("completedTools")) {
          db.createObjectStore("completedTools", { keyPath: "id" });
        }

        // Store para configurações gerais
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };
    });
  }

  async saveData(storeName, data) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      // Limpar dados existentes
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Adicionar novos dados
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            store.add({ id: key, value });
          }
        });
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async loadData(storeName) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = {};
        request.result.forEach((item) => {
          result[item.id] = item.value;
        });
        resolve(result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveSetting(key, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["settings"], "readwrite");
      const store = transaction.objectStore("settings");

      store.put({ key, value });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async loadSetting(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["settings"], "readonly");
      const store = transaction.objectStore("settings");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        ["completedItems", "completedDays", "completedTools", "settings"],
        "readwrite"
      );

      transaction.objectStore("completedItems").clear();
      transaction.objectStore("completedDays").clear();
      transaction.objectStore("completedTools").clear();
      transaction.objectStore("settings").clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

const learningDB = new LearningDB();
export default learningDB;
