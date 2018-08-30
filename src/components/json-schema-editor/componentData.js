import Components from './components'

export var componentData = [
  new Components.StringComponent('Type string'),
  new Components.IntegerComponent('Type integer'),
  new Components.NumberComponent('Type number'),
  new Components.BooleanComponent('Type boolean'),
  new Components.ObjectComponent('Type object'),
  new Components.ArrayComponent('Type array'),
  new Components.NullComponent('Type null'),
  new Components.PropertiesComponent('List properties of object'),
  new Components.RequiredComponent('List required properties of object'),
  new Components.DependenciesComponent('List dependencies between properties'),
  new Components.DependencyItemComponent('List of properties which specific property depend on'),
  new Components.ItemsComponent('List type of each item'),
  new Components.EnumComponent('List of valid values'),
  new Components.AllOfComponent('Data must be valid against all of the given subschemas'),
  new Components.AnyOfComponent('Data must be valid against any of the given subschemas'),
  new Components.OneOfComponent('Data must be valid against exactly one of the given subschemas'),
  new Components.NotComponent('Data must not be valid against all of the given subschemas'),
  new Components.RefComponent('Reference to external schema'),
  new Components.DefinitionsComponent('Definitions of reusable schema')
]

export default componentData
