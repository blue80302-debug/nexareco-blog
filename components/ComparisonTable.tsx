interface ComparisonRow {
  label: string;
  valueA: string;
  valueB: string;
  winner?: "A" | "B" | "tie";
}

interface ComparisonTableProps {
  productA: string;
  productB: string;
  rows: ComparisonRow[];
}

export default function ComparisonTable({
  productA,
  productB,
  rows,
}: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4 text-left font-semibold text-gray-500">
              &nbsp;
            </th>
            <th className="py-3 px-4 text-left font-bold text-gray-900">
              {productA}
            </th>
            <th className="py-3 px-4 text-left font-bold text-gray-900">
              {productB}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-3 px-4 font-medium text-gray-700">
                {row.label}
              </td>
              <td
                className={`py-3 px-4 ${row.winner === "A" ? "text-green-700 font-semibold" : "text-gray-600"}`}
              >
                {row.valueA}
              </td>
              <td
                className={`py-3 px-4 ${row.winner === "B" ? "text-green-700 font-semibold" : "text-gray-600"}`}
              >
                {row.valueB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
