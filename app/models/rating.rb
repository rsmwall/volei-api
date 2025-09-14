class Ratings < ApplicationController
  def create
    @rating = Rating.new(rating_params)
    if @rating.save
      render json: @rating, status: :created
    else
      render json: @rating.errors, status: :unprocessable_content
    end
  end

  private

  def rating_params
    params.require(:rating).permit(:rater_id, :rated_id, :match_id, :score)
  end
end