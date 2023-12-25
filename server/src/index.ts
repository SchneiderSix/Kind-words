import { Elysia } from 'elysia'
import MongodbConnection from './config/mongodb';
import { lettersModule } from './modules/letters';
import { rateLimit } from 'elysia-rate-limit';
import { cors } from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';

/**
 * Await for connection to mongodb with atlas and launch Elysia
 */
const run = async () => {
	await MongodbConnection();

	const app = new Elysia()
	.use(cors({
		origin: /localhost:4200$/
	}))
	.use(helmet({}))
	.use(lettersModule)
	.use(rateLimit())
	.get('/', () => 'hello world')
	.listen(8080);

	console.log(`🦊 Elysia is running at port ${app.server?.port}...`);
}

run();
