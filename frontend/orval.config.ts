module.exports = {
    petstore: {
        output: {
            mode: 'tags-split',
            target: 'src/lib/api/index.ts',
            schemas: 'src/lib/api/model',
            client: 'react-query',
            mock: true,
            override: {
                mutator: {
                    path: './src/AxiosClient.ts',
                    name: 'customInstance',
                },
            },
        },

        input: {
            target: './api-docs.yaml',
        },
    },
};
