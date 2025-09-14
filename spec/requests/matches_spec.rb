require 'swagger_helper'

RSpec.describe 'Matches API', type: :request do
  path '/matches' do
    post 'Creates a match' do
      tags 'Matches'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :match, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, example: 'Pelada de Sábado' },
          location: { type: :string, example: 'Quadra do bairro' },
          date: { type: :string, format: 'date-time', example: '2025-09-20T14:00:00Z' },
          category: { type: :string, example: 'mista' },
          status: { type: :string, example: 'new' },
          organizer_id: { type: :integer, example: 1 }
        },
        required: %w[title location date category organizer_id]
      }

      response '201', 'match created' do
        let(:match) { { title: 'Partida Teste', location: 'Praça Central', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1 } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:match) { { title: 'Partida Teste' } }
        run_test!
      end
    end

    get 'Retrieves all matches' do
      tags 'Matches'
      produces 'application/json'

      response '200', 'matches found' do
        let!(:match1) { Match.create(title: 'Partida Teste 1', location: 'Local 1', date: '2025-09-20T14:00:00Z', category: 'mista', status: 'new', organizer_id: 1) }
        let!(:match2) { Match.create(title: 'Partida Teste 2', location: 'Local 2', date: '2025-09-21T15:00:00Z', category: 'masculina', status: 'new', organizer_id: 1) }
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data.count).to eq(2)
        end
      end
    end
  end
end