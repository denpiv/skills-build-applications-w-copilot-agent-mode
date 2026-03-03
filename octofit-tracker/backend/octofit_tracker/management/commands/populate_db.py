from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data using Django ORM'

    def handle(self, *args, **options):
        # Clear existing data using direct MongoDB (Djongo ORM delete has issues)
        try:
            client = MongoClient(host='localhost', port=27017)
            db = client['octofit_db']
            db['octofit_tracker_user'].delete_many({})
            db['octofit_tracker_team'].delete_many({})
            db['octofit_tracker_activity'].delete_many({})
            db['octofit_tracker_leaderboard'].delete_many({})
            db['octofit_tracker_workout'].delete_many({})
        except Exception as e:
            self.stdout.write(f'Note: Could not clear collections directly: {e}')

        # Create teams (without members initially)
        marvel_team, _ = Team.objects.get_or_create(name='Marvel')
        dc_team, _ = Team.objects.get_or_create(name='DC')

        # Create Marvel users
        iron_man, _ = User.objects.get_or_create(
            username='iron_man',
            defaults={
                'email': 'ironman@marvel.com',
                'first_name': 'Tony',
                'last_name': 'Stark',
                'team': marvel_team,
            },
        )
        cap, _ = User.objects.get_or_create(
            username='captain_america',
            defaults={
                'email': 'cap@marvel.com',
                'first_name': 'Steve',
                'last_name': 'Rogers',
                'team': marvel_team,
            },
        )
        widow, _ = User.objects.get_or_create(
            username='black_widow',
            defaults={
                'email': 'widow@marvel.com',
                'first_name': 'Natasha',
                'last_name': 'Romanoff',
                'team': marvel_team,
            },
        )

        # Create DC users
        superman, _ = User.objects.get_or_create(
            username='superman',
            defaults={
                'email': 'superman@dc.com',
                'first_name': 'Clark',
                'last_name': 'Kent',
                'team': dc_team,
            },
        )
        batman, _ = User.objects.get_or_create(
            username='batman',
            defaults={
                'email': 'batman@dc.com',
                'first_name': 'Bruce',
                'last_name': 'Wayne',
                'team': dc_team,
            },
        )
        wonder_woman, _ = User.objects.get_or_create(
            username='wonder_woman',
            defaults={
                'email': 'wonderwoman@dc.com',
                'first_name': 'Diana',
                'last_name': 'Prince',
                'team': dc_team,
            },
        )

        # Update team members
        marvel_team.members = [iron_man, cap, widow]
        marvel_team.save()
        dc_team.members = [superman, batman, wonder_woman]
        dc_team.save()

        # Create activities
        Activity.objects.get_or_create(
            user=iron_man, defaults={'type': 'Run', 'duration': 30, 'calories': 280}
        )
        Activity.objects.get_or_create(
            user=cap, defaults={'type': 'Cycle', 'duration': 60, 'calories': 420}
        )
        Activity.objects.get_or_create(
            user=widow, defaults={'type': 'Swim', 'duration': 45, 'calories': 320}
        )
        Activity.objects.get_or_create(
            user=superman, defaults={'type': 'Run', 'duration': 50, 'calories': 350}
        )
        Activity.objects.get_or_create(
            user=batman, defaults={'type': 'Cycle', 'duration': 40, 'calories': 280}
        )
        Activity.objects.get_or_create(
            user=wonder_woman, defaults={'type': 'Swim', 'duration': 55, 'calories': 380}
        )

        # Create leaderboard entries
        Leaderboard.objects.get_or_create(team=marvel_team, defaults={'score': 150})
        Leaderboard.objects.get_or_create(team=dc_team, defaults={'score': 120})

        # Create workouts
        Workout.objects.get_or_create(
            name='HIIT Blast',
            defaults={
                'description': 'High-intensity interval training with bodyweight circuits',
                'difficulty': 'Hard',
            },
        )
        Workout.objects.get_or_create(
            name='Core Builder',
            defaults={'description': 'Core-focused strength circuit', 'difficulty': 'Medium'},
        )
        Workout.objects.get_or_create(
            name='Yoga Flow',
            defaults={'description': 'Gentle yoga and stretching routine', 'difficulty': 'Easy'},
        )
        Workout.objects.get_or_create(
            name='Cardio Burst',
            defaults={'description': 'Short and intense cardio session', 'difficulty': 'Hard'},
        )

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data via Django ORM.'))
