class RatingCreationService
  def self.call(rating_params)
    rater_id = rating_params['rater_id'].to_i
    rated_id = rating_params['rated_id'].to_i
    match_id = rating_params['match_id'].to_i
    score = rating_params['score'].to_i

    unless PlayerQueryService.find_by_id(rater_id) && PlayerQueryService.find_by_id(rated_id)
      return { success: false, errors: ["Rater or Rated Player not found."] }
    end
    unless MatchQueryService.find_by_id(match_id)
      return { success: false, errors: ["Match not found."] }
    end

    final_params = {
      rater_id: rater_id,
      rated_id: rated_id,
      match_id: match_id,
      score: score
    }

    rating = Rating.new(final_params)
    
    if rating.save
      return { success: true, rating: rating }
    else
      return { success: false, errors: rating.errors.full_messages }
    end
  rescue ActiveRecord::StatementInvalid
    return { success: false, errors: ["Player already rated this player for this match."] }
  end
end