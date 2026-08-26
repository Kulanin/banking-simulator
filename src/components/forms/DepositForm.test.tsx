import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepositForm from "./DepositForm";
import { NotificationProvider } from "../../context/NotificationProvider";
import useFetch from "../../customHooks/useFetch";

vi.mock("../../customHooks/useFetch", () => ({
  default: vi.fn(),
}));
vi.mock("../../customHooks/useFetch", () => ({
  default: vi.fn().mockReturnValue({
    data: null,
    loading: false,
    error: null,
    message: "",
    isError: false,
    isSuccess: false,
    getFetchResponse: false,
    customFetchData: vi.fn().mockResolvedValue({}),
    refreshDB: vi.fn(),
    resetMessageErrorStatuses: vi.fn(),
    setLoading: vi.fn(),
  }),
}));
describe("DepositForm", () => {
  it("renders the Deposit button", () => {
    const fetchUserAccounts = vi.fn();

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    expect(
      screen.getByRole("button", {
        name: /deposit/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens the deposit dialog when the user clicks Deposit", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    const depositButton = screen.getByRole("button", {
      name: /deposit/i,
    });

    await user.click(depositButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("allows the user to enter an amount", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /deposit/i,
      }),
    );

    const amountInput = screen.getByRole("spinbutton", {
      name: /amount/i,
    });

    await user.type(amountInput, "500");

    expect(amountInput).toHaveValue(500);
  });

  it("closes the dialog when the user clicks Cancel", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /deposit/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("successfully deposits funds", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();

    const customFetchData = vi.fn().mockResolvedValue({
      message: "Deposit successful",
    });

    vi.mocked(useFetch).mockReturnValue({
      data: [],
      loading: false,
      error: null,
      message: "Deposit successful",
      isError: false,
      isSuccess: true,
      getFetchResponse: true,
      customFetchData,
      refreshDB: vi
        .fn()
        .mockImplementation((url, options) => customFetchData(url, options)),
      resetMessageErrorStatuses: vi.fn(),
      setLoading: vi.fn() as React.Dispatch<React.SetStateAction<boolean>>,
    });

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: /deposit/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const amountInput = screen.getByRole("spinbutton", {
      name: /amount/i,
    });

    await user.type(amountInput, "500");
    expect(amountInput).toHaveValue(500);

    const dialog = screen.getByRole("dialog");

    const submitButton = within(dialog).getByRole("button", {
      name: /deposit/i,
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(customFetchData).toHaveBeenCalledTimes(1);
    });

    expect(customFetchData).toHaveBeenCalledWith(
      "/api/v1/accounts/1/deposit",
      expect.objectContaining({
        method: "POST",
        idempotencyKey: expect.any(String),
        querydata: expect.objectContaining({
          amount: "500",
          actionType: "deposit",
          idempotencyKey: expect.any(String),
        }),
      }),
      true,
    );

    expect(fetchUserAccounts).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("displays an error message when the deposit fails", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();

    const customFetchData = vi
      .fn()
      .mockRejectedValueOnce(new Error("Invalid deposit amount"));

    vi.mocked(useFetch).mockReturnValue({
      data: null,
      loading: false,
      error: "Invalid deposit amount",
      message: "",
      isError: true,
      isSuccess: false,
      getFetchResponse: true,
      customFetchData,
      refreshDB: vi
        .fn()
        .mockImplementation((url, options) => customFetchData(url, options)),
      resetMessageErrorStatuses: vi.fn(),
      setLoading: vi.fn() as React.Dispatch<React.SetStateAction<boolean>>,
    });

    render(
      <NotificationProvider>
        <DepositForm accountId={1} fetchUserAccounts={fetchUserAccounts} />
      </NotificationProvider>,
    );

    await user.click(screen.getByRole("button", { name: /deposit/i }));

    const amountInput = screen.getByRole("spinbutton", { name: /amount/i });
    await user.type(amountInput, "500");

    const dialog = screen.getByRole("dialog");
    const submitButton = within(dialog).getByRole("button", {
      name: /deposit/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(customFetchData).toHaveBeenCalledTimes(1);
    });

    const errorAlert = await screen.findByText(/invalid deposit amount/i);
    expect(errorAlert).toBeInTheDocument();

    expect(fetchUserAccounts).not.toHaveBeenCalled();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
