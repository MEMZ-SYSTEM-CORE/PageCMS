import type { RequestHandler } from './$types';

const GITHUB_OWNER = 'MEMZ-SYSTEM-CORE';
const GITHUB_REPO = 'giscuz';
const GISCUS_CATEGORY_ID = 'DIC_kwDOTXCGP84DBGZC';

export const prerender = false;

function getToken(platform: App.Platform | undefined): string {
  if (platform?.env?.GITHUB_TOKEN) return platform.env.GITHUB_TOKEN;
  if (process?.env?.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  return '';
}

const queryComments = `
  query {
    repository(owner: "${GITHUB_OWNER}", name: "${GITHUB_REPO}") {
      discussions(first: 100) {
        nodes {
          id
          title
          url
          comments(first: 50) {
            nodes {
              id
              body
              createdAt
              author { login avatarUrl }
            }
          }
        }
      }
    }
  }
`;

const mutationDelete = (commentId: string) => `
  mutation {
    deleteDiscussionComment(input: { id: "${commentId}" }) {
      clientMutationId
    }
  }
`;

export const GET: RequestHandler = async ({ platform }) => {
  const token = getToken(platform);
  if (!token) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryComments }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `GitHub API error: ${res.status}` }), { status: 502 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, platform }) => {
  const token = getToken(platform);
  if (!token) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  const { commentId } = await request.json();
  if (!commentId) {
    return new Response(JSON.stringify({ error: 'Missing commentId' }), { status: 400 });
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutationDelete(commentId) }),
    });

    const data = await res.json();
    if (data.errors) {
      return new Response(JSON.stringify({ error: data.errors[0].message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
