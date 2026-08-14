import type { Bot } from "../types/Bot";

type BotTableProps = {
  bots: Bot[];
  onDelete: (id: number) => void;
  onEdit: (bot: Bot) => void;
};

function BotTable({ bots, onDelete, onEdit }: BotTableProps) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "24px",
      }}
    >
      <thead>
        <tr>
          <th style={headerStyle}>ID</th>
          <th style={headerStyle}>Name</th>
          <th style={headerStyle}>Username</th>
          <th style={headerStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {bots.map((bot) => (
          <tr key={bot.botId}>
            <td style={cellStyle}>{bot.botId}</td>
            <td style={cellStyle}>{bot.name}</td>
            <td style={cellStyle}>{bot.username}</td>

            <td style={cellStyle}>
              <button
                onClick={() => onEdit(bot)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>

              <button onClick={() => onDelete(bot.botId)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const headerStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left" as const,
  backgroundColor: "#f4f4f4",
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default BotTable;
