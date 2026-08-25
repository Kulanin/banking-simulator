import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DepositForm from "./DepositForm";
import { NotificationProvider } from "../../context/NotificationProvider";

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
});
