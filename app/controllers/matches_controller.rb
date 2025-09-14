class MatchesController < ApplicationController
    def create
        @match = Match.new(match_params)
        if @match.save
            render json: @match, status: :created
        else
            render json: @match.errors, status: :unprocessable_content
        end
    end

    def index
        @matches = Match.all
        render json: @matches, status: :ok
    end

    private

    def match_params
        params.require(:match).permit(:title, :location, :date, :category, :status, :organizer_id)
    end
end
