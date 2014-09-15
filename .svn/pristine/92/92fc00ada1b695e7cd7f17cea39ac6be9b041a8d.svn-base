/* View to get Training Events */
CREATE VIEW UpcomingTraining AS
SELECT 
wp_posts.id,
wp_posts.post_title as Class,
metaS.meta_value as StartDate, 
metaE.meta_value as EndDate,
rel.term_taxonomy_id as Category
FROM wp_posts
INNER JOIN wp_postmeta as metaS ON wp_posts.id = metaS.post_id AND metaS.meta_key = '_EventStartDate'
INNER JOIN wp_postmeta as metaE ON wp_posts.id = metaE.post_id AND metaE.meta_key = '_EventEndDate'
INNER JOIN wp_term_relationships as rel ON wp_posts.id = rel.object_id AND rel.term_taxonomy_id = 60
WHERE metaS.meta_value >= NOW()
ORDER BY  `wp_posts`.`post_date` ASC
