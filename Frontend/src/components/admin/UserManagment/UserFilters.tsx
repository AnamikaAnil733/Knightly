interface Filters {
  blocked: boolean;
  newUser: boolean;
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  blockedCount: number;
  newUserCount: number;
}

export function UserFilters({
  filters,
  setFilters,
  blockedCount,
  newUserCount,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {/* BLOCKED */}
      <button
        disabled={blockedCount === 0}
        onClick={() =>
          setFilters((prev) => ({ ...prev, blocked: !prev.blocked }))
        }
        className={`px-4 py-2 rounded-md text-sm border transition
          ${
            filters.blocked
              ? "bg-red-600 text-white border-red-600"
              : "bg-[#11193F] text-gray-300 border-gray-700"
          }
          ${blockedCount === 0 && "opacity-40 cursor-not-allowed"}
        `}
      >
        Blocked ({blockedCount})
      </button>

      {/* NEW USERS */}
      <button
        disabled={newUserCount === 0}
        onClick={() =>
          setFilters((prev) => ({ ...prev, newUser: !prev.newUser }))
        }
        className={`px-4 py-2 rounded-md text-sm border transition
          ${
            filters.newUser
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[#11193F] text-gray-300 border-gray-700"
          }
          ${newUserCount === 0 && "opacity-40 cursor-not-allowed"}
        `}
      >
        New Users ({newUserCount})
      </button>

      {/* CLEAR */}
      {(filters.blocked || filters.newUser) && (
        <button
          onClick={() => setFilters({ blocked: false, newUser: false })}
          className="px-4 py-2 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          Clear
        </button>
      )}
    </div>
  );
}
