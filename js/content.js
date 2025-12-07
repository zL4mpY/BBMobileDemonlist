import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = 'https://raw.githubusercontent.com/zL4mpY/bbmdl_data/refs/heads/main';

// export async function fetchList() {
//     const listResult = await fetch(`${dir}/_list.json`, {
//          'Authorization': `token ${GITHUB_ACCESS_TOKEN}`,
//          'Accept': 'application/vnd.github.v3.raw'
//     });
    
//     try {
//         const list = await listResult.json();
//         return await Promise.all(
//             list.map(async (path, rank) => {
//                 const levelResult = await fetch(`${dir}/${path}.json`);
//                 try {
//                     const level = await levelResult.json();
//                     return [
//                         {
//                             ...level,
//                             path,
//                             records: level.records.sort(
//                                 (a, b) => b.percent - a.percent,
//                             ),
//                         },
//                         null,
//                     ];
//                 } catch {
//                     console.error(`Failed to load level #${rank + 1} ${path}.`);
//                     return [null, path];
//                 }
//             }),
//         );
//     } catch {
//         console.error(`Failed to load list.`);
//         return null;
//     }
// }

export async function fetchList() {
    const res = await fetch('/api/fetch-list'); // ← Cloudflare Pages Function
    if (!res.ok) {
        console.error('Failed to load list from API');
        return null;
    }

    try {
        const list = await res.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {

    const res = await fetch('/api/fetch-editors'); // ← Cloudflare Pages Function
    if (!res.ok) {
        console.error('Failed to load editors from API');
        return null;
    }

    const editors = await res.json();
    return editors;
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // // Verification
        // const verifier = Object.keys(scoreMap).find(
        //     (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        // ) || level.verifier;
        // scoreMap[verifier] ??= {
        //     verified: [],
        //     completed: [],
        //     progressed: [],
        // };
        // const { verified } = scoreMap[verifier];
        // verified.push({
        //     rank: rank + 1,
        //     level: level.name,
        //     score: score(rank + 1, 100, level.percentToQualify),
        //     link: level.verification,
        // });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}
