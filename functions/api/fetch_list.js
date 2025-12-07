export async function onRequest({ env }) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // берётся из секретов Cloudflare
    const REPO_URL = 'https://raw.githubusercontent.com/zL4mpY/bbmdl_data/refs/heads/main';

    try {
        // Загружаем список уровней
        const listRes = await fetch(`${REPO_URL}/_list.json`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3.raw',
            },
        });

        if (!listRes.ok) throw new Error('Failed to fetch _list.json');
        const list = await listRes.json();

        return new Response(JSON.stringify(list), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Failed to load data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
