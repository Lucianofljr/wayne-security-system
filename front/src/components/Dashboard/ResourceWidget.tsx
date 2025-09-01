import { useState } from "react";
import styles from "./ResourcesWidget.module.css";

interface Resource {
  id: number;
  title: string;
  url: string;
}

interface ResourcesWidgetProps {
  userRole: string;
  onResourceUpdate: () => void;
}

export function ResourcesWidget({ userRole, onResourceUpdate }: ResourcesWidgetProps) {
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "Guia de Treinamento", url: "https://example.com/treinamento" },
    { id: 2, title: "Documentação Interna", url: "https://example.com/docs" },
    { id: 3, title: "Planilha de KPIs", url: "https://example.com/kpis" },
  ]);

  const handleAddResource = () => {
    const newResource: Resource = {
      id: resources.length + 1,
      title: `Novo Recurso ${resources.length + 1}`,
      url: "https://example.com",
    };
    setResources((prev) => [...prev, newResource]);
    onResourceUpdate();
  };

  const handleRemoveResource = (id: number) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    onResourceUpdate();
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3>Recursos</h3>
        {(userRole === "admin" || userRole === "gerente") && (
          <button className={styles.addButton} onClick={handleAddResource}>
            + Adicionar
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {resources.map((resource) => (
          <li key={resource.id} className={styles.item}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {resource.title}
            </a>

            {(userRole === "admin" || userRole === "gerente") && (
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveResource(resource.id)}
              >
                Remover
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}