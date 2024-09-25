import {
  ACTIONS_CORS_HEADERS,
  type ActionGetResponse,
  type ActionPostRequest,
  type ActionPostResponse,
} from "@solana/actions";

import { type Betting } from "@/entities/betting";
import { type Quest } from "@/entities/quest";
import { formatPercent, formatToken } from "@/utils/numberFormatter";
import { env } from "@/env";

type RequestParams = {
  params: Record<string, string>;
};

type ActionParams = {
  choice: string; // answer id as string
  amount: number; // amount of tokens to bet
};

type CalRewardInput = {
  questAmount: number;
  answerAmount: number;
  spent: number;
};

function calculatePotentialReward({
  questAmount,
  answerAmount,
  spent,
}: CalRewardInput): number {
  if (spent <= 0) {
    return 0;
  }

  const totalQuestAmount = questAmount + spent;
  const totalAnswerAmount = answerAmount + spent;

  return totalQuestAmount * (spent / totalAnswerAmount);
}

export const GET = async (_req: Request, reqParams: RequestParams) => {
  try {
    const res = await fetch(
      `${env.API_URL}/api/actions/quests/${reqParams.params.id}`,
    );
    const { quest, error }: { quest: Quest; error: string } = await res.json();

    const response: ActionGetResponse = {
      icon: quest.imageUrl,
      title: quest.title,
      description:
        quest.totalAmount > 0
          ? `Total: ${formatToken(quest.totalAmount, { symbol: quest.token.symbol })}`
          : "",
      label: "Vote",
      links: {
        actions: [
          {
            label: "Vote",
            href: `/api/actions/vote/${quest.id}`,
            parameters: [
              {
                type: "select",
                name: "choice",
                label: "Select your choice",
                required: true,
                options: quest.answers.map(
                  ({ id, title, totalAmount, percent }) => ({
                    label: `${title} (${[formatToken(totalAmount, { symbol: quest.token.symbol }), percent && formatPercent(percent)].filter(Boolean).join(" - ")})`,
                    value: id.toString(),
                  }),
                ),
              },
              {
                type: "number",
                name: "amount",
                label: `Enter your ${quest.token.symbol} amount`,
                required: true,
                min: 1 / 10 ** Math.ceil(quest.token.decimals / 3),
              },
            ],
          },
        ],
      },
      disabled: Boolean(error),
      error: error
        ? {
            message: error,
          }
        : undefined,
    };
    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    return Response.json(
      { error: String(err) },
      { headers: ACTIONS_CORS_HEADERS, status: 500 },
    );
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request, reqParams: RequestParams) => {
  let body: ActionPostRequest<ActionParams>;
  try {
    body = await req.json();
    if (!body.data) {
      throw new Error("Missing data");
    }
  } catch (err) {
    return Response.json(
      { error: "Invalid request body" },
      { headers: ACTIONS_CORS_HEADERS, status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${env.API_URL}/api/actions/bettings/${reqParams.params.id}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    const { betting, transaction }: { betting: Betting; transaction: string } =
      await res.json();
    const { answer, quest } = betting;
    const potentialReward = calculatePotentialReward({
      answerAmount: answer.totalAmount,
      questAmount: betting.quest.totalAmount,
      spent: betting.spent,
    });

    const response: ActionPostResponse = {
      transaction,
      links: {
        next: {
          type: "inline",
          action: {
            type: "completed",
            icon: quest.imageUrl,
            title: quest.title,
            description: `\
Synced to https://polyquest.xyz\n\
Your answer: ${answer.title}\n\
Your vote amount: ${formatToken(betting.spent, quest.token)}\n\
Potential reward: ${formatToken(potentialReward, quest.token)}\
              `,
            label: "Success",
          },
        },
      },
    };
    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    return Response.json(
      { error: String(err) },
      { headers: ACTIONS_CORS_HEADERS, status: 500 },
    );
  }
};
