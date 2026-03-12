import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBoard } from "./useBoard";
import { BoardData } from "../dal/board";

const mockBoard: BoardData = {
  board: {
    _id: "board1",
    name: "Test Board",
    userId: "user1",
    columns: ["col1", "col2"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  columns: [
    {
      _id: "col1",
      name: "Wishlist",
      boardId: "board1",
      order: 0,
      jobApplications: ["job1"],
      jobs: [
        {
          _id: "job1",
          position: "Dev",
          company: "Google",
          columnId: "col1",
          boardId: "board1",
          status: "wishlist",
          order: 0,
          userId: "user1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "col2",
      name: "Applied",
      boardId: "board1",
      order: 1,
      jobApplications: [],
      jobs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

describe("useBoard", () => {
  it("should initialize with board data", () => {
    const { result } = renderHook(() => useBoard(mockBoard));
    expect(result.current.columns).toHaveLength(2);
    expect(result.current.columns[0].jobs).toHaveLength(1);
  });

  it("should move a job between columns", () => {
    const { result } = renderHook(() => useBoard(mockBoard));

    act(() => {
      result.current.moveJob("job1", "col2", false, true);
    });

    expect(result.current.columns[0].jobs).toHaveLength(0);
    expect(result.current.columns[1].jobs).toHaveLength(1);
    expect(result.current.columns[1].jobs[0]._id).toBe("job1");
    expect(result.current.columns[1].jobs[0].columnId).toBe("col2");
  });
});
