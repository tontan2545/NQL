const runInference = async (question: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/inference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
};

export const inferenceService = {
  runInference,
};
