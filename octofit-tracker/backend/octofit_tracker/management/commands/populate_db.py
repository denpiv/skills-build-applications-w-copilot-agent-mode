from django.core.management.base import BaseCommand
from pymongo import MongoClient
from bson.objectid import ObjectId

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data using direct MongoDB'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient(host='localhost', port=27017)
        db = client['octofit_db']

        # Clear existing data
        db['octofit_tracker_user'].delete_many({})
        db['octofit_tracker_team'].delete_many({})
        db['octofit_tracker_activity'].delete_many({})
        db['octofit_tracker_leaderboard'].delete_many({})
        db['octofit_tracker_workout'].delete_many({})

        # Create teams
        marvel_team_doc = {
            'name': 'Marvel',
            'members': [],
        }
        marvel_result = db['octofit_tracker_team'].insert_one(marvel_team_doc)
        marvel_team_id = marvel_result.inserted_id

        dc_team_doc = {
            'name': 'DC',
            'members': [],
        }
        dc_result = db['octofit_tracker_team'].insert_one(dc_team_doc)
        dc_team_id = dc_result.inserted_id

        # Create Marvel users
        iron_man_doc = {
            'username': 'iron_man',
            'email': 'ironman@marvel.com',
            'first_name': 'Tony',
            'last_name': 'Stark',
            'team': marvel_team_id,
        }
        iron_man_result = db['octofit_tracker_user'].insert_one(iron_man_doc)
        iron_man_id = iron_man_result.inserted_id

        cap_doc = {
            'username': 'captain_america',
            'email': 'cap@marvel.com',
            'first_name': 'Steve',
            'last_name': 'Rogers',
            'team': marvel_team_id,
        }
        cap_result = db['octofit_tracker_user'].insert_one(cap_doc)
        cap_id = cap_result.inserted_id

        widow_doc = {
            'username': 'black_widow',
            'email': 'widow@marvel.com',
            'first_name': 'Natasha',
            'last_name': 'Romanoff',
            'team': marvel_team_id,
        }
        widow_result = db['octofit_tracker_user'].insert_one(widow_doc)
        widow_id = widow_result.inserted_id

        # Create DC users
        superman_doc = {
            'username': 'superman',
            'email': 'superman@dc.com',
            'first_name': 'Clark',
            'last_name': 'Kent',
            'team': dc_team_id,
        }
        superman_result = db['octofit_tracker_user'].insert_one(superman_doc)
        superman_id = superman_result.inserted_id

        batman_doc = {
            'username': 'batman',
            'email': 'batman@dc.com',
            'first_name': 'Bruce',
            'last_name': 'Wayne',
            'team': dc_team_id,
        }
        batman_result = db['octofit_tracker_user'].insert_one(batman_doc)
        batman_id = batman_result.inserted_id

        wonder_woman_doc = {
            'username': 'wonder_woman',
            'email': 'wonderwoman@dc.com',
            'first_name': 'Diana',
            'last_name': 'Prince',
            'team': dc_team_id,
        }
        wonder_woman_result = db['octofit_tracker_user'].insert_one(wonder_woman_doc)
        wonder_woman_id = wonder_woman_result.inserted_id

        # Update team members with ObjectId references
        db['octofit_tracker_team'].update_one(
            {'_id': marvel_team_id},
            {'$set': {'members': [iron_man_id, cap_id, widow_id]}}
        )
        db['octofit_tracker_team'].update_one(
            {'_id': dc_team_id},
            {'$set': {'members': [superman_id, batman_id, wonder_woman_id]}}
        )

        # Create activities
        activity_docs = [
            {'user': iron_man_id, 'type': 'Run', 'duration': 30, 'calories': 280},
            {'user': cap_id, 'type': 'Cycle', 'duration': 60, 'calories': 420},
            {'user': widow_id, 'type': 'Swim', 'duration': 45, 'calories': 320},
            {'user': superman_id, 'type': 'Run', 'duration': 50, 'calories': 350},
            {'user': batman_id, 'type': 'Cycle', 'duration': 40, 'calories': 280},
            {'user': wonder_woman_id, 'type': 'Swim', 'duration': 55, 'calories': 380},
        ]
        db['octofit_tracker_activity'].insert_many(activity_docs)

        # Create leaderboard entries
        leaderboard_docs = [
            {'team': marvel_team_id, 'score': 150},
            {'team': dc_team_id, 'score': 120},
        ]
        db['octofit_tracker_leaderboard'].insert_many(leaderboard_docs)

        # Create workouts
        workout_docs = [
            {
                'name': 'HIIT Blast',
                'description': 'High-intensity interval training with bodyweight circuits',
                'difficulty': 'Hard',
            },
            {
                'name': 'Core Builder',
                'description': 'Core-focused strength circuit',
                'difficulty': 'Medium',
            },
            {
                'name': 'Yoga Flow',
                'description': 'Gentle yoga and stretching routine',
                'difficulty': 'Easy',
            },
            {
                'name': 'Cardio Burst',
                'description': 'Short and intense cardio session',
                'difficulty': 'Hard',
            },
        ]
        db['octofit_tracker_workout'].insert_many(workout_docs)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data via direct MongoDB.'))
