import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationProvider } from "../../context/NotificationProvider";
import WithdrawForm from "./WithdrawForm";
import userEvent from "@testing-library/user-event";

describe("Withdraw Form", () => {
  it("test withdraw button appears", () => {
    const fetchUserAccounts = vi.fn();

    render(
      <NotificationProvider>
        <WithdrawForm
          fetchUserAccounts={fetchUserAccounts}
          accountId={1}
          accounts={[]}
        />
      </NotificationProvider>,
    );
  });

  it("opens the deposit dialog when the user clicks Withdraw", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();
    render(
      <NotificationProvider>
        <WithdrawForm
          fetchUserAccounts={fetchUserAccounts}
          accountId={1}
          accounts={[]}
        />
      </NotificationProvider>,
    );

    const withdrawButton = screen.getByRole("button", {
      name: /withdraw/i,
    });

    await user.click(withdrawButton);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeInTheDocument();
  });

  it("allows the user to enter an amount", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();
    render(
      <NotificationProvider>
        <WithdrawForm
          fetchUserAccounts={fetchUserAccounts}
          accountId={1}
          accounts={[]}
        />
      </NotificationProvider>,
    );

    const withdrawButton = screen.getByRole("button", {
      name: /withdraw/i,
    });

    await user.click(withdrawButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const withdrawInput = screen.getByRole("spinbutton", {
      name: /amount/i,
    });

    await user.type(withdrawInput, "100");
    expect(withdrawInput).toHaveValue(100);
  });

  it("closes the dialog when the user clicks Cancel", async () => {
    const user = userEvent.setup();
    const fetchUserAccounts = vi.fn();
    render(
      <NotificationProvider>
        <WithdrawForm
          fetchUserAccounts={fetchUserAccounts}
          accountId={1}
          accounts={[]}
        />
      </NotificationProvider>,
    );

    const withdrawButton = screen.getByRole("button", {
      name: /withdraw/i,
    });

    await user.click(withdrawButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    await user.click(cancelButton);

    waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });


});
