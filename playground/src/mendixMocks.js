import { useMemo, useState } from "react";

export function createAction(handler) {
  return {
    canExecute: true,
    execute: (variables) => {
      if (typeof handler === "function") {
        handler(variables);
      }
    },
  };
}

export function createDatasourceAction(handler) {
  return {
    get: (item) => ({
      canExecute: true,
      execute: (variables) => {
        if (typeof handler === "function") {
          handler(item, variables);
        }
      },
    }),
  };
}

export function createScalarAttribute(source, setSource, key, options = {}) {
  return {
    value: source[key],
    readOnly: Boolean(options.readOnly),
    validation: options.validation || "",
    universe: options.universe,
    setValue: (nextValue) => {
      setSource((previous) => ({
        ...previous,
        [key]: nextValue,
      }));
    },
  };
}

export function createAssociationAttribute(source, setSource, key, options = {}) {
  return {
    value: source[key],
    readOnly: Boolean(options.readOnly),
    validation: options.validation || "",
    setValue: (nextValue) => {
      setSource((previous) => ({
        ...previous,
        [key]: nextValue,
      }));
    },
  };
}

export function createListAttribute(setItems, key, options = {}) {
  return {
    get: (item) => ({
      value: item[key],
      readOnly: Boolean(options.readOnly),
      validation: options.validation || "",
      setValue: (nextValue) => {
        setItems((previous) =>
          previous.map((entry) =>
            String(entry.id) === String(item.id)
              ? {
                  ...entry,
                  [key]: nextValue,
                }
              : entry,
          ),
        );
      },
    }),
  };
}

export function createReadonlyListAttribute(key, options = {}) {
  return {
    get: (item) => ({
      value: item[key],
      readOnly: true,
      validation: options.validation || "",
      setValue: () => {},
    }),
  };
}

export function createDataSource(items) {
  return {
    status: "available",
    items,
  };
}

export function useActionLog(initial = []) {
  const [entries, setEntries] = useState(initial);

  const api = useMemo(
    () => ({
      entries,
      push: (label, payload) => {
        setEntries((previous) => [
          {
            id: Date.now() + Math.random(),
            label,
            payload,
            at: new Date().toLocaleTimeString("en-GB"),
          },
          ...previous,
        ]);
      },
      clear: () => setEntries([]),
    }),
    [entries],
  );

  return api;
}
