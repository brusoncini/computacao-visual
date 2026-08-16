document.addEventListener("DOMContentLoaded", carregarPosts);

async function carregarPosts() {

    const postsGrid = document.querySelector("#posts-grid");

    if (!postsGrid) {
        return;
    }

    try {

        const resposta = await fetch("data/posts.json", {
            cache: "no-store"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os posts.");
        }

        const posts = await resposta.json();

        posts.sort((a, b) => {

            const diferencaData =
                new Date(b.dataPublicacao) -
                new Date(a.dataPublicacao);

            if (diferencaData !== 0) {
                return diferencaData;
            }

            return b.id - a.id;
        });

        const limite = parseInt(
            postsGrid.dataset.limit,
            10
        );

        const postsExibidos = Number.isNaN(limite)
            ? posts
            : posts.slice(0, limite);


        postsGrid.innerHTML = postsExibidos
            .map(criarCard)
            .join("");

    } catch (erro) {

        console.error("Erro ao carregar posts:", erro);

        postsGrid.innerHTML = `
            <p>
                Não foi possível carregar os posts :(
            </p>
        `;
    }
}


function criarCard(post) {

    return `
        <article class="post-card">

            <div class="post-image">
                <span>${post.icone}</span>
            </div>

            <div class="post-content">

                <span class="post-category">
                    ${post.categoria}
                </span>

                <h3>
                    ${post.titulo}
                </h3>

                <p>
                    ${post.descricao}
                </p>

                <a href="${post.link}">
                    Ler post ♡
                </a>

            </div>

        </article>
    `;
}