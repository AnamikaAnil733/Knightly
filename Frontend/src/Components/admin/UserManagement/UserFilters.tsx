import { UserFilter } from "../../../Pages/Admin/UserManagment";

interface Props {
  filter: UserFilter;
  setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
  blockedCount: number;
  unblockedCount: number;
}

export function UserFilters({
  filter,
  setFilter,
  blockedCount,
  unblockedCount,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">

      {/* BLOCKED */}
      <button
        disabled={blockedCount === 0}
        onClick={() =>
          setFilter((prev) =>
            prev === "BLOCKED" ? "ALL" : "BLOCKED"
          )
        }
        className={`px-4 py-2 rounded-md text-sm border transition
          ${
            filter === "BLOCKED"
              ? "bg-red-600 text-white border-red-600"
              : "bg-[#11193F] text-gray-300 border-gray-700"
          }
          ${blockedCount === 0 && "opacity-40 cursor-not-allowed"}
        `}
      >
        Blocked ({blockedCount})
      </button>

      {/* UNBLOCKED */}
      <button
        disabled={unblockedCount === 0}
        onClick={() =>
          setFilter((prev) =>
            prev === "UNBLOCKED" ? "ALL" : "UNBLOCKED"
          )
        }
        className={`px-4 py-2 rounded-md text-sm border transition
          ${
            filter === "UNBLOCKED"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[#11193F] text-gray-300 border-gray-700"
          }
          ${unblockedCount === 0 && "opacity-40 cursor-not-allowed"}
        `}
      >
        Unblocked ({unblockedCount})
      </button>

      {/* CLEAR */}
      {filter !== "ALL" && (
        <button
          onClick={() => setFilter("ALL")}
          className="px-4 py-2 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          Clear
        </button>
      )}
    </div>
  );
}
