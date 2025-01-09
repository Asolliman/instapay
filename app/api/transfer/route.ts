import { NextResponse } from "next/server";
import Account from "@/lib/models/account";
import Transaction from "@/lib/models/transaction";
import Payment from "@/lib/models/payment";

export async function POST(request: Request) {
  const { Sender_Id, Receiver_Id, Amount } = await request.json();

  if (!Sender_Id || !Receiver_Id || !Amount) {
    return NextResponse.json(
      { error: "Sender ID, Receiver ID, and Amount are required" },
      { status: 400 }
    );
  }

  try {
    // Validate sender and receiver accounts
    const senderAccount = await Account.findOne({ where: { User_Id: parseInt(Sender_Id, 10) } });
    const receiverAccount = await Account.findOne({ where: { User_Id: parseInt(Receiver_Id, 10) } });

    if (!senderAccount) {
      return NextResponse.json({ error: "Sender account not found" }, { status: 404 });
    }

    if (!receiverAccount) {
      return NextResponse.json({ error: "Receiver account not found" }, { status: 404 });
    }

    // Check if the sender has enough balance
    if (senderAccount.dataValues.Balance < parseInt(Amount)) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct from sender and add to receiver
    senderAccount.dataValues.Balance -= parseInt(Amount);
    receiverAccount.dataValues.Balance += parseInt(Amount);

    // Save changes
    await Account.update({ Balance: senderAccount.dataValues.Balance } , { where: { User_Id: parseInt(Sender_Id, 10) } } );
    await Account.update({ Balance: receiverAccount.dataValues.Balance }, { where: { User_Id: parseInt(Receiver_Id, 10) } });


// Log the transfer as a transaction
await Transaction.create({
  Transaction_ID: parseInt(Receiver_Id, 10),

  User_Id: parseInt(Sender_Id, 10),
  Type: "Transfer",
  Amount: parseFloat(Amount),
  Description: `Sent to User ${Receiver_Id}`,
});

await Payment.create({
  Payment_Id: parseInt(Sender_Id, 10),
  Amount: parseInt(Amount, 10),
  Type: "Transfer",
  Status: "Completed",
})


    return NextResponse.json({
      message: "Transfer successful",
      senderBalance: senderAccount.dataValues.Balance,
      receiverBalance: receiverAccount.dataValues.Balance,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
