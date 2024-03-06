import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_KEY_SECRET
);

export async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: { id: string; name: string; image?: string } }>(
    "/signup",
    async (req, res) => {
      const { id, name, image } = req.body;
      if (id === null || id === "" || name === null || name === "") {
        res.status(400).send({ message: "Invalid input" });
      }

      const existingUser = await streamChat.queryUsers({ id });

      if (existingUser.users.length > 0) {
        res.status(400).send("User already exists");
      }

      // TODO : Check For existing user
      await streamChat.upsertUser({ id, name, image });
    }
  );

  app.post<{ Body: { id: string } }>("/login", async (req, res) => {
    const { id } = req.body;
    if (id === null || id === "") {
      res.status(400).send({ message: "Invalid input" });
    }

    const {
      users: [user],
    } = await streamChat.queryUsers({ id });

    if (user == null) return res.status(400).send;

    const token = streamChat.createToken(id);

    return {
      token,
      user: { name: user.name, id: user.id, image: user.image },
    };
  });
}
